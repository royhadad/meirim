const geoms = require('../tags/ecological_bottlenecks_test_geoms');
const { doesTagApply } = require('../../../../api/lib/tags/ecological_bottlenecks/ecological_bottlenecks');
const TagsResources = require('../../../../api/lib/tags/tags_resources');
const expect = require('chai').expect;


describe('Ecological Bottlenecks Tag', function() {
    const tagsResource = new TagsResources.TagsResources();

    it('should not apply ecological bottleneck tag', async () => {
        const plan = {
            id: 7,
            attributes: {
                geom: geoms.geomPlanNotInEcologicalBottleneck
            }
        };

        const res = await doesTagApply(plan, tagsResource);
        expect(res).to.eql(null);
    });

    it('should apply ecological bottleneck tag', async () => {
       const plan = {
           id: 7,
           attributes: {
               geom: geoms.geomPlanInEcologicalBottleneck
           }
       };

       const res = await doesTagApply(plan, tagsResource);
       const dataRules = JSON.parse(res.created_by_data_rules);
       expect(dataRules.length).to.eql(1);
       expect(dataRules[0].bottleneckName).to.eql('בין משואות יצחק לניר ישראל');
       expect(dataRules[0].dunam).to.be.within(304, 305);

    });

});