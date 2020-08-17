const ParserIndex = require('../../../api/lib/mavat/planInstructions/index');
const path = require('path');
const assert = require('assert');


describe('Taba1 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan1';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('explanation', () =>
        assert.strictEqual(data.planExplanation, 'תכנית זו מוסיפה אחוזי בנייה כללים למגרש מספר 17המאשר לפי תכנית תמ"ל1008 בחלקה מספר 216 גוש \n' +
            '16607 באדמות טורעאן.\n' +
            'התכנית מוספה שטח אחוזי בנייה כללים, מאחר ושטח המגרש הוא גדול בהרבה יחסית לממוצע המגרשים \n' +
            'באותה תכנית, המאפשר שמירה על תכנית הבנוי של התכנית תמ"ל1008, חניון פיתוח וכו\'.'));

    it('should have only one row on table 5', () =>
        assert.strictEqual(data.chartFive.length, 1));

    describe('table 5 single row parsing test', () => {
        let tbl5FirstRow;

        before(() =>
            tbl5FirstRow = data.chartFive[0]);

        it('designation', () =>
            assert.strictEqual(tbl5FirstRow.designation, "מגורים א'"));

        it('use', () =>
            assert.strictEqual(tbl5FirstRow.use, "מגורים א'"));

        it('taei shetah', () =>
            assert.strictEqual(tbl5FirstRow.area_number, '100'));

        it('location', () =>
            assert.strictEqual(tbl5FirstRow.location, 'רכס טורעאן - תמ"ל 1008'));

        it('field size sqm test', () =>
            assert.strictEqual(tbl5FirstRow.field_size_sqm, '775'));

        it('size sqm above primary entrance', () =>
            assert.strictEqual(tbl5FirstRow.above_primary_main, '570'));

        it('size sqm above service entrance', () =>
            assert.strictEqual(tbl5FirstRow.above_primary_service, '150'));

        it('size sqm below primary entrance', () =>
            assert.strictEqual(tbl5FirstRow.below_primary_main, '180'));

        it('size sqm below service entrance', () =>
            assert.strictEqual(tbl5FirstRow.below_primary_service, '50'));

        it('overall building lands (sah hakol shithey bniya)', () =>
            assert.strictEqual(tbl5FirstRow.overall_building_land, '950'));

        it('building percentage', () =>
            assert.strictEqual(tbl5FirstRow.building_percentage, '122.58'));

        it('tahsit', () =>
            assert.strictEqual(tbl5FirstRow.tahsit === '' || tbl5FirstRow.tahsit === undefined,
                true));

        it('density yahad to dunam', () =>
            assert.strictEqual(tbl5FirstRow.density_yahad_to_dunam === '' || tbl5FirstRow.densityYahadToDunam === undefined,
                true));

        it('number of housing units', () =>
            assert.strictEqual(tbl5FirstRow.num_of_housing_units, '3'));

        it('height of building meters', () =>
            assert.strictEqual(tbl5FirstRow.height_above_entrance, '12'));

        it('floors above entrance', () =>
            assert.strictEqual(tbl5FirstRow.floors_above, '3'));

        it('floors below entrance', () =>
            assert.strictEqual(tbl5FirstRow.floors_below, '1'));

        it('building right side line', () =>
            assert.strictEqual(tbl5FirstRow.side_line_right, '3'));

        it('building left side line', () =>
            assert.strictEqual(tbl5FirstRow.side_line_left, '3'));

        it('building back side line', () =>
            assert.strictEqual(tbl5FirstRow.side_line_back, '5'));

        it('building front side line', () =>
            assert.strictEqual(tbl5FirstRow.side_fine_front, '5'));

    });
});

describe('Taba2 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan2';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('explanation', () => {
        assert.strictEqual(data.planExplanation.includes('מטרת התכנית הינה הגדרת שימושים בקרקע חקלאית בחלקות ב\' במושב ארבל'), true);
        assert.strictEqual(data.planExplanation.includes('מיוחדות המבוקש בתכנית.'), true);
    });

    it('should have 3 rows on table 5', () =>
        assert.strictEqual(data.chartFive.length, 3));

    describe('table 5 last row parsing test', () => {
        let tbl5ThirdRow;

        before(() => {
            tbl5ThirdRow = data.chartFive[2];
        });

        it('designation', () =>
            assert.strictEqual(tbl5ThirdRow.designation, "קרקע חקלאית"));

        it('use', () =>
            assert.strictEqual(tbl5ThirdRow.use, "מבני תפעול תחזוקה ובקרה"));

        it('taei shetah', () =>
            assert.strictEqual(tbl5ThirdRow.area_number, '101'));

        it('location', () =>
            assert.strictEqual(tbl5ThirdRow.location, ''));

        it('field size sqm test', () =>
            assert.strictEqual(tbl5ThirdRow.field_size_sqm, '51453.23'));

        it('size sqm above primary entrance', () =>
            assert.strictEqual(tbl5ThirdRow.above_primary_main, '705'));

        it('size sqm above service entrance', () =>
            assert.strictEqual(tbl5ThirdRow.above_primary_service, '12'));

        it('size sqm below primary entrance', () =>
            assert.strictEqual(tbl5ThirdRow.below_primary_main, ''));

        it('size sqm below service entrance', () =>
            assert.strictEqual(tbl5ThirdRow.below_primary_service, ''));

        it('overall building land (sah hakol shithey bniya)', () =>
            assert.strictEqual(tbl5ThirdRow.overall_building_land, '717'));

        it('building percentage', () =>
            assert.strictEqual(tbl5ThirdRow.building_percentage === '' ||
                tbl5ThirdRow.building_percentage === undefined, true));

        it('tahsit', () =>
            assert.strictEqual(tbl5ThirdRow.tahsit, '35.64'));

        it('density yahad to dunam', () =>
            assert.strictEqual(tbl5ThirdRow.density_yahad_to_dunam === '' ||
                tbl5ThirdRow.density_yahad_to_dunam === undefined, true));

        it('number of housing units', () =>
            assert.strictEqual(tbl5ThirdRow.num_of_housing_units, ''));

        it('height of building meters', () =>
            assert.strictEqual(tbl5ThirdRow.height_above_entrance, '6'));

        it('floors above entrance', () =>
            assert.strictEqual(tbl5ThirdRow.floors_above, '1'));

        it('floors below entrance', () =>
            assert.strictEqual(tbl5ThirdRow.floors_below === undefined || tbl5ThirdRow.floorsBelow ==='',
                true));

        it('building right side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_line_right, '3'));

        it('building left side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_line_left, '3'));

        it('building back side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_line_back, '3'));

        it('building front side line', () =>
            assert.strictEqual(tbl5ThirdRow.side_fine_front, '5'));

    });
});

// This taba exists in the test to check for a case of tahsit and building percentage at one table
describe('Taba3 parsing test', () => {
    let data;
    const TEST_PLANS_DIR = 'test_plan3';

    before(async () =>
        data = await ParserIndex.processPlanInstructionsFile(path.join(__dirname, TEST_PLANS_DIR)));

    it('data should not be undefined', async () =>
        assert.notStrictEqual(data, undefined));

    it('data should have one row on table 5', () =>
        assert.strictEqual(data.chartFive.length, 1));

    describe('Chart 5 parsing test', () => {
       let tbl5FirstRow;

        before(() =>
            tbl5FirstRow = data.chartFive[0]);

        it('building percentage', () =>
            assert.strictEqual(tbl5FirstRow.building_percentage, '144'));

        it('tahsit', () =>
            assert.strictEqual(tbl5FirstRow.tahsit, '42'));

        it('density yahad to dunam', () =>
            assert.strictEqual(tbl5FirstRow.density_yahad_to_dunam, '6'));

    });


});
