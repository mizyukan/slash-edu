PagesControllers.controller('MaterialsCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.materials = [];
        $scope.pages = [];
        $scope.currentPage = 0;
        $scope.itemsPerPage = 10;
        $scope.numberMaterial = 0;
        $scope.materialGroups = [];
        $scope.name='';

        $scope.setCurrentPage = function(val) {$scope.currentPage = val;};
        $scope.incCurrentPage = function()  {
            if($scope.currentPage < $scope.materials.length / $scope.itemsPerPage - 1 ){
                $scope.currentPage++; $scope.numberMaterial+=$scope.itemsPerPage;}
        };

        $scope.decCurrentPage = function() {
            if($scope.currentPage > 0 ){
                $scope.currentPage--; $scope.numberMaterial-=$scope.itemsPerPage;}
        };

        $scope.deleteMaterial = function(material) {
            var i = $scope.materials.indexOf(material)
            $scope.materials.splice(i,1)
            $http.delete('/api/materials/'+material._id)
                .then(function(res) {

                });
        };


        $scope.deleteMaterialGroup = function(group) {
            var i = $scope.materialGroups.indexOf(group)
            $scope.materialGroups.splice(i,1)
            $http.delete('/api/materialGroups/'+group._id)
                .then(function(res) {

                });
        };

        $http.get('/api/materials')
            .then(function(response){
                $scope.materials = response.data;
                $scope.pages = [];
                for(var i = 0; i < $scope.materials.length / $scope.itemsPerPage; i++) $scope.pages.push(i);
            });

        function updateMaterialGroups(){
            $http.get('/api/materialGroups')
                .then(function(response) {
                    $scope.materialGroups = response.data;
                }
            );
        }
        updateMaterialGroups();

        $scope.createGroup  = function () {

             $http.put('/api/materialGroups', {
                 name: $scope.name,
                 parent: null
             }).then(function() {
                 updateMaterialGroups();
             });
        }
        $scope.clickOnGroup = function(groupId)
        {
            $http.get('/api/materials?materialGroupID=' + groupId)
                .then(function(response) {
                    $scope.materials = response.data;
                }
            )
            console.log("clickOnGroup "+groupId)
            $scope.groupId=groupId;
        }

        $scope.newMaterial = function()
        {
            $http.put('/api/materials/groupId', {
              groupId: $scope.groupId
            }).then(function() {

            });
            console.log("newMaterial "+$scope.groupId)
        }
    }
]);