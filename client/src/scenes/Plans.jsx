import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import InfiniteScroll from "react-infinite-scroll-component";

import api from "../services/api";
import locationAutocompleteApi from "../services/location-autocomplete";

import Wrapper from "../components/Wrapper";
import Mapa from "../components/Mapa";
import UnsafeRender from "../components/UnsafeRender";
import Autocomplete from "../components/AutoCompleteInput";

import t from "../locale/he_IL";
import "./Plans.css";

class Plans extends Component {
    state = {
        error: false,
        hasMore: true,
        noData: false,
        pageNumber: 1,
        plans: [],
        address:'',
        addressLocation:[],
        list:[]
    };

    constructor(props) {
        super(props);

        this.loadPlans = this.loadPlans.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);
    }

    handleAddressSubmit(address) {
        // reset current displayed plans
        this.setState({
            plans: [],
            pageNumber:1,
            searchPoint: {}
        });

        // get selected place id
        const placeId = this.findPlaceIdFromSuggestion(address);

        // get place location
        locationAutocompleteApi.getPlaceLocation(placeId)
            .then(location => {
                // this will trigger a component update which will identify the new
                // query string and initiate a location search
                this.props.history.push(`${window.location.pathname}?loc=${location.lat},${location.lng}`);
            }).catch(error => this.setState({ error: "שגיאה בחיפוש לפי כתובת" }));
    }

    findPlaceIdFromSuggestion(string){
        let {list} = this.state;
        return _.find(list,i=> i.label===string).id
    }

    handleInputChange(text) {
        if (text) {
            this.setState({
                loadingAutocomplete: true
            });

            this.getAutocompleteSuggestions(text);
        } else {
            // cancel previously-called debounced autocomplete
            this.getAutocompleteSuggestions.cancel();

            this.setState({
                list: []
            });
        }
    }

    getAutocompleteSuggestions = _.debounce((input) => {
        locationAutocompleteApi.autocomplete(input).then((res) => {
            this.setState({
                loadingAutocomplete: false,
                list: res
            });
        }).catch(error => {
            this.setState({ error: "שגיאה בחיפוש לפי כתובת" });
        });
    }, process.env.CONFIG.geocode.autocompleteDelay);

    loadPlans(pageNumber, point) {
        this.setState({
            noData: false
        });

        api.get(
            `/plan/?page=${pageNumber}`+
            (point ? `&distancePoint=${point.lng},${point.lat}` : "")
            
        )
            .then(result => {
                this.setState({
                    hasMore:
                        result.pagination.page < result.pagination.pageCount,
                    noData: this.state.plans.length + result.data.length === 0,
                    pageNumber,
                    plans: [...this.state.plans, ...result.data]
                });
            })
            .catch(error => this.setState({ error: "שגיאה בשליפת תוכניות" }));
    }

    loadNextPage() {
        this.loadPlans(this.state.pageNumber + 1, this.state.searchPoint);
    }

    loadQsSearchParams() {
        // read query string
        const qs = new URLSearchParams(this.props.location.search);

        let searchLocation;

        // load "loc" param and make sure it is the right format
        if (qs.get('loc')) {
            const locParts = qs.get('loc').split(',').map(i => parseFloat(i));
            if (locParts.length === 2 && !isNaN(locParts[0]) && !isNaN(locParts[1])) {
                searchLocation = {lat: locParts[0], lng: locParts[1]};
            }
        }

        if (searchLocation !== undefined) {
            // reset plans in case this was a navigation
            this.setState({
                plans: [],
                pageNumber:1,
                searchPoint: searchLocation
            });

            // load plans by params
            this.loadPlans(1, searchLocation);

            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        // init location service
        locationAutocompleteApi.init();

        // if there is no valid query string params to search by run default search
        if (!this.loadQsSearchParams()) {
            this.loadPlans(this.state.pageNumber);
        }
    }

    componentDidUpdate(prevProps) {
        // if the query string has changed load it into a search
        if (this.props.location.search !== prevProps.location.search) {
            this.loadQsSearchParams();
        }
    }

    render() {
        const { plans, error, noData, hasMore, list } = this.state;

        return (
            <Wrapper>
                <div className="container">
                    <Autocomplete  classes=""
                        placeholder="חדש! צפו בתוכניות בקרבת כתובת לבחירתכם "
                        inputSuggestions={list}
                        onFilterChange={this.handleAddressSubmit.bind(this)}
                        onInputChange={this.handleInputChange.bind(this)}
                    />
                    <br />
                    <GridList
                        cellHeight={500}
                        cellWidth={335}
                        className="gridList"
                        cols={1}
                    >
                        {plans.map(plan => (
                            <Card className="card" raised={true} key={plan.id}>
                                <Link
                                    className="card-link"
                                    to={`/plan/${plan.id}`}
                                >
                                    <CardActionArea className="card-action-area">
                                        <CardMedia
                                            className="card-media"
                                            title={plan.PL_NUMBER}
                                        >
                                            <Mapa
                                                geom={plan.geom}
                                                hideZoom={true}
                                                disableInteractions={true}
                                                title={plan.PLAN_COUNTY_NAME}
                                                title2={plan.distance?` ${Math.ceil(plan.distance/5)*5} מ׳ מהכתובת`:'' }
                                            />
                                        </CardMedia>
                                        <CardContent className="card-content">
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2"
                                                color="textPrimary"
                                            >
                                                {plan.PL_NAME}
                                            </Typography>
                                            <Typography component="p" color="textPrimary">
                                                <UnsafeRender
                                                    html={
                                                        plan.main_details_from_mavat
                                                    }
                                                />
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Link>
                            </Card>
                        ))}
                    </GridList>

                    {error && <div className="error-container">{error}</div>}
                    {noData && <div>אין כאן כלום</div>}
                </div>
                <InfiniteScroll
                    dataLength={plans.length}
                    next={this.loadNextPage}
                    hasMore={hasMore}
                    loader={<h4 className="centerNote">{t.loading}</h4>}
                    endMessage={
                        <p className="centerNote">
                            <b>{t.seenAllPlans}</b>
                        </p>
                    }
                />
            </Wrapper>
        );
    }
}

export default Plans;
