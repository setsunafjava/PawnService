/**
 * Created by Administrator on 1/6/2016.
 */
angular.module('myApp').factory('TradeMarkService',[
    '$resource',
    function($resource){
        return $resource('api/trademarks/:trademarkId',{
            trademarkId : '@_id'
        },{
            update : {
                method : 'PUT'
            }
        });
    }
]);