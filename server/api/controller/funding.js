const axios = require('axios');
const Controller = require('./controller');
const Config = require('../lib/config').paymentServices;
const FundingTransaction = require('../model/funding_transaction');
const Exception = require('../model/exception');

let instance = axios.create({
	baseURL: Config.baseURL
});

const paymentDefaultConfig = {
	"action": "APISign",
	"What": "SIGN",
	"KEY": Config.apiKey,
	"PassP": Config.PassP,
	"Masof": Config.masofId,
	"UTF8": "True",
	"UTF8out": "True",
	"Coin": 1,
	"sendemail": "True",
	"SendHesh": "True",
	"PageLang": "HEB",
	"tmp": 11,
	"Pritim": "True",
	"OnlyOnApprove": "True"
};

class FundingController extends Controller {
	create (req, res, next) {
		// validate fields are provided
		if (req.body.yaad_id === undefined) {
			return Promise.reject(new Exception.BadRequest('No yaad_id provided'));
		} else if (req.body.hk_id === undefined) {
			return Promise.reject(new Exception.BadRequest('No hk_id provided'));
		} else if (req.body.amount === undefined) {
			return Promise.reject(new Exception.BadRequest('No amount provided'));
		}

		// TODO: validate transaction is verified

		const fundingTransaction = new FundingTransaction(req.body);

		// save and return no data
		return fundingTransaction.save(null, {autoRefresh: false}).then(() => true);
	}

	paymentLink (req) {
		const { query } = req;

		let params = {
			...paymentDefaultConfig,
			Amount: query.amount || 50
		};

		if (query.monthly) {
			params.HK = "True";
			params.Info = "תרומה חודשית לעמותת מעירים";
			params.heshDesc = ["", "תרומה%20חודשית%20לעמותת%20מעירים", "1", `${params.Amount}`].join('~');
		} else {
			params.Info = "תרומה חד פעמית לעמותת מעירים";
			params.heshDesc = ["", "תרומה%חד%20פעמית%20לעמותת%20מעירים", "1", `${params.Amount}`].join('~');
		}
		
		return instance.get('/', {
			params
		}).then(res => `${Config.baseURL}/?action=pay&${res.data}`);
	}

	getFundingStats () {
		return this.model.getCurrentFundingStats()
			.then(currentAmount => {
				const statsRow = currentAmount.first();
				return {
					totalAmount: statsRow.get('total_amount') || 0,
					count: statsRow.get('count') || 0,
				};
		});
	}
}

module.exports = new FundingController(FundingTransaction);
