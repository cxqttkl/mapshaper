var api = require('../'),
    assert = require('assert');

var Utils = api.Utils;

describe('mapshaper-shapefile.js', function () {

  describe('Export/Import roundtrip tests', function () {
    it('Six counties', function () {
      shapefileRoundTrip('test_data/six_counties.shp');
    })

    it('Six counties, two null geometries', function () {
      shapefileRoundTrip('test_data/two_states.shp');
    })

    it('Polylines from shplib', function () {
      shapefileRoundTrip('test_data/shplib/pline.shp');
    })

    it('Polygons from shplib', function() {
      shapefileRoundTrip('test_data/shplib/polygon.shp');
    })

    it('World land borders from Natural Earth', function() {
      shapefileRoundTrip('test_data/ne/ne_110m_admin_0_boundary_lines_land.shp');
    })

    it('U.S. states from Natural Earth', function() {
      shapefileRoundTrip('test_data/ne/ne_110m_admin_1_states_provinces_shp.shp');
    })

    it('Pacific groupings from Natural Earth', function() {
      shapefileRoundTrip('test_data/ne/ne_110m_admin_0_pacific_groupings.shp');
    })
  })
})


function shapefileRoundTrip(fname) {
  var data = api.importFromFile(fname, 'shapefile');
  var topo = api.buildTopology(data);
  var arcs = new api.ArcDataset(topo.arcs);
  var out = api.exportShp({arcs: arcs, shapes: topo.shapes, type: data.info.input_geometry_type})

  var data2 = api.importShp(out.shp);
  var topo2 = api.buildTopology(data2);
  var arcs2 = new api.ArcDataset(topo2.arcs);
  var out2 = api.exportShp({arcs: arcs2, shapes: topo2.shapes, type: data2.info.input_geometry_type})

  assert.deepEqual(data.pathData, data2.pathData);
  assert.deepEqual(topo.shapes, topo2.shapes);
  assert.ok(Utils.buffersAreIdentical(out.shp, out2.shp));
}