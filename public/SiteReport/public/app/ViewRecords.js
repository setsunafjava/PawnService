/**
 * Created by Admin on 3/14/2016.
 */
app.controller('ViewRecords', function ($scope, $rootScope, $http, Data,$state,$interval,_) {
    //initially set those objects to null to avoid undefined error
    $scope.listFields = {};
    $scope.listRecords = [];
    $scope.listProjects = {};
    $scope.listPackages = {};
    $scope.listTables = {};
    var check =0;
$scope.$watchCollection(function () {
    return $scope.listRecords;
},function(newValue,oldValue){

    console.log(_.difference(newValue, oldValue)) ;
});

 $scope.reloadRecord  = function(table_id){   Data.get('recordfordatatable/'+table_id).then(function (results) {
        console.log(results);
        $scope.listRecords = results;
    });
 };

    $scope.reloadField  = function(table_id) {
        Data.get('fieldfordatatable/'+table_id).then(function (results) {
            $scope.listFields = results;


        });
    };
    $scope.uploadFile = function(){

        var file = $scope.myFile;
        var uploadUrl = "/multer";
        Data.postUpload(uploadUrl,{"sheetname": "Log Work",tablename :"Log Work"},file).then(function (results) {
            Data.toast(results);

        });
    };


    Data.get('projects').then(function (results) {
        console.log(results);
        $scope.listProjects = results;


    });
    $scope.loadPackage = function(project_id){
        $scope.packageSelected = "xxx";

        $scope.listTables = {};
        $scope.listPackages= {};

        if(project_id==="xxx"){

        }else{
            console.log(project_id);

            Data.get('packageforproject/'+project_id).then(function (results) {


                $scope.listPackages = results;




            });
        }

    };
    $scope.loadTable =function(package_id){
        console.log(package_id);
        Data.get('datatablesforpackage/'+package_id).then(function (results) {
            console.log(results);
            $scope.listTables = results;

        });
    };
    $scope.viewRecord = function(table_id){
        $scope.reloadRecord(table_id);
        $scope.reloadField(table_id);
    };
        $scope.testshow = function () {
        $('#modal_form').modal('show');

    };
    $scope.testhide = function () {
        $('#modal_form').modal('hide');

    };
    $scope.add_record = function(){
        $scope.statusEdit = "add";
        $scope.testshow();
    };
    $scope.delete_record = function(item){
        var record_id = item.currentTarget.getAttribute("record_id");
        Data.delete('recordfordatatable/'+record_id.split("_")[1]+'/'+record_id).then(function (results) {

            console.log(results);
            $scope.reloadRecord(record_id.split("_")[1]);
            Data.toast({status: "success",message : "Delete Success"});
        });
    };

    $scope.showEdit = function(item){
        var record_id = item.currentTarget.getAttribute("record_id");
        Data.get('recordfordatatable/'+record_id.split("_")[1]+'/'+record_id).then(function (results) {


            $scope.listFields.forEach(function(re){
                $("input[name='"+re.title+"']").val(results[re.title]);
            });
            $scope.testshow();

        });
        $scope.statusEdit = "edit";
        $("#btnSave").attr("record_id", record_id);
    };

    $scope.edit_record = function(item){
        if($scope.statusEdit=="add"){
            $scope.data = {};
            $scope.listFields.forEach(function(re){
                $scope.data[re.title]=$("input[name='"+re.title+"']").val()
            });
            Data.post('recordfordatatable/67',$scope.data).then(function (results) {
                $scope.testhide();
                $scope.listFields.forEach(function(re){
                    $("input[name='"+re.title+"']").val('');
                });
                //console.log(results);
                $scope.reloadRecord("67");
                Data.toast({status: "success",message : "Add New Success"});
            });
        }else {
            console.log("Edit record");
            var record_id = item.currentTarget.getAttribute("record_id");
            var data = {};
            $scope.listFields.forEach(function(re){
                data[re.title]=$("input[name='"+re.title+"']").val()
            });
            Data.put('recordfordatatable/'+record_id.split("_")[1]+'/'+record_id,data).then(function (results) {

                console.log(results);
                $scope.reloadRecord(record_id.split("_")[1]);
                $scope.testhide();
                $scope.listFields.forEach(function(re){
                    $("input[name='"+re.title+"']").val('');
                });
                Data.toast({status: "success",message : "Edit Success"});

            });
        }

    };
    $scope.testhehe = function(){
        $scope.data = {};
        $scope.listFields.forEach(function(re){
            $scope.data[re.title]=$("input[name='"+re.title+"']").val()
        });
        Data.post('recordfordatatable/67',$scope.data).then(function (results) {
            $scope.testhide();
            $scope.listFields.forEach(function(re){
                $("input[name='"+re.title+"']").val('');
            });
            //console.log(results);
            $scope.reloadRecord("67");
            Data.toast({status : "Success"});
        });


    };
    $scope.cutSpace = function(str){
      return str.split(" ").join("_");
    };
});