var express = require('express');
var router = express.Router();
var kramed = require('kramed');
var db = require('../../db');
var Materials = db.model('Materials');

var ObjectId = db.Types.ObjectId;
var groupId;
router.post('/preview', function(req, res) {
  var html = kramed(req.body.src);
  res.send(html);
});

function createMaterialObject(req_body) {
  return {
    name: req_body.name,
    type: req_body.type,
    data: {
      src: req_body.src,
      html: kramed(req_body.src)
    }
  };
}

router.put('/', function(req, res) {
  var newMat = new Materials(createMaterialObject(req.body));
    newMat.parent = groupId;
    console.log("Privet "+newMat.parent)
  newMat.save(function(err) {

    if (err) res.sendStatus(400);
    else res.sendStatus(200);
  });
});

router.get('/', function(req, res) {

  var query = {};
  if (req.query.materialGroupID) {
    query.parent = new ObjectId(req.query.materialGroupID);
  }


  Materials.find(query, function(err, materials){

    res.send(materials);
 });
});

router.get('/:materialId', function(req, res) {

  Materials.findById(req.params.materialId, function (err, material){
    material.save(function(err){
      if(err) return andleError(err);
      res.send({
        data: material.data,
        name: material.name,
        type: material.type
      });
    });
  });
});

router.post('/:materialId', function(req, res) {

  Materials.findByIdAndUpdate(req.params.materialId, { $set: createMaterialObject(req.body)}, function (err, material) {
    res.send(material);
  });

});

router.delete('/:material', function(req, res) {
  Materials.findByIdAndRemove(req.params.material, function(err) {
    res.sendStatus(200);
  });
});

router.put('/:groupId', function(req, res) {
    groupId = req.body.groupId;

});

module.exports = router;
