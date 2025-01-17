import { useTranslation } from 'locale/he_IL';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { device } from 'style';
import styled from 'styled-components';
import Autocomplete from '../../components/AutoCompleteInput';
import locationAutocompleteApi from '../../services/location-autocomplete';

const Wrapper = styled.div`
    background-color: ${({background})=> background || '#652DD0'};
    ${({background})=> !background && `box-shadow: 0px 29.6621px 147.057px rgba(0, 0, 0, 0.0503198), 0px 15.8588px 78.6238px rgba(0, 0, 0, 0.0417275), 0px 8.8903px 44.0759px rgba(0, 0, 0, 0.035), 0px 4.72157px 23.4084px rgba(0, 0, 0, 0.0282725);`}
    padding: 23px;
    width: 100%;
    height: ${({ height })=> height || '148px'};
    margin: 1em auto;
    z-index: 1;
	margin-bottom: 5px;

    @media ${device.tablet} {
        width: 512px;
        height: 100px;
		padding: ${({ wrapperPadding })=> wrapperPadding || '32px' };
        margin: ${({ wrapperMargin })=> wrapperMargin || "32px 0px 0px 0px" };
        border-radius: 12px;
    }
`;

const Title = styled.p`
    color: ${({ color })=> color || '#ffffff' };
    text-align: right;
    font-size: 22px;
    line-height: 22px;
    margin-bottom: 22px;

    @media ${device.tablet} {
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 28px;
    }
`;

const Button = styled.button`
    margin-right: auto;
    background: transparent;
    width: 120px;
    height: 32px;
    border: 1px solid ${({color})=> color || '#FFFFFF'};
    border-radius: 4px;
    text-align: center;
    padding: 5px 0;
    color: ${({color})=> color || '#FFFFFF'};
    line-height: 1;
    cursor: pointer;

    @media ${device.tablet} {
        margin-right: 0;
    }
`;

const AutocompleteWrapper = styled.div`
    margin-bottom: 35px;
    width: 100%;

    @media ${device.tablet} {
        margin-bottom: 0;
        width: 305px;
    }

    input[type="text"] {
        color: ${({color})=> color || '#FFFFFF'};
        font-size: 14px;
        line-height: 18px;

        &::placeholder {
            opacity: 1;
        }
    }

    .MuiPaper-elevation1 {
        border-radius: 0px 0px 12px 12px;
        border: 1px solid #652DD0;
        font-size: 16px;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;

    @media ${device.tablet} {
        flex-direction: row;
        justify-content: space-between;
    }

    .text{
        font-family:Assistant;
    }
`;

export default function SearchBox({ backgroundColor, color, showTitle, wrapperMargin, wrapperPadding, height }) {
	const [addresses, setAddresses] = useState([]);
	const [placeId, setPlaceId] = useState('');
	const [loadingAutocomplete, setloadingAutocomplete] = useState(false);
	const { t } = useTranslation();

	const getAutocompleteSuggestions = useCallback(
		_.debounce(async (input) => {
			const res = await locationAutocompleteApi.autocomplete(input);
			setloadingAutocomplete(false);
			setAddresses(res);
		}, process.env.CONFIG.geocode.autocompleteDelay),
		[]
	);

	async function onInputChange(input) {
		if (input) {
			setloadingAutocomplete(true);
			getAutocompleteSuggestions(input);
		} else {
			// cancel pending calls and clear results
			getAutocompleteSuggestions.cancel();
			setloadingAutocomplete(false);
			setAddresses([]);
		}
	}
    
	function onFilterChange(data) {
		if (data) {
			const place = addresses.find(address => address.label === data);
			if (place) {
				setPlaceId(place.id);
			}
		}
	}

	async function onGoToPlansClick() {
		if (placeId) {
			const { lat, lng } = await locationAutocompleteApi.getPlaceLocation(placeId);
			window.location.href = `/plans?loc=${lat},${lng}`;
		}
	}
	useEffect(()=>{
		locationAutocompleteApi.init();
	},[]);

	return (
		<Wrapper background={backgroundColor} height={height} wrapperMargin={wrapperMargin} wrapperPadding={wrapperPadding}>
			{showTitle && <Title color={color}>{t.searchBoxTitle}</Title>}
			<InputWrapper>
				<AutocompleteWrapper color={color}>
					<Autocomplete 
						placeholder={t.searchAddress}
						inputSuggestions={addresses}
						onInputChange={onInputChange}
						onFilterChange={onFilterChange}
						classes={{ inputRoot:'text' }}
						loading={loadingAutocomplete}
					/>
				</AutocompleteWrapper>
				<Button type="button" onClick={onGoToPlansClick} color={color} >{t.watchPlans}</Button>
			</InputWrapper>
		</Wrapper>
	);
}