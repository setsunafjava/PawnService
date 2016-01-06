/**
 * Created by Administrator on 1/6/2016.
 */
/**
 * Created by Administrator on 1/5/2016.
 */
/**
 * Created by Tommy_Phan on 21/11/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TradeMarkSchema = new Schema({
    title: {
        type : String,
        required: 'Title is required',
        trim: true
    },
    description: {
        type : String,
        require : true
    },
    creator:{
        type  :Schema.ObjectId,
        ref : 'User'
    },
    created:{
        type : Date,
        default:Date.now
    },
    updatetor:{
        type  :Schema.ObjectId,
        ref : 'User'
    },
    updated:{
        type : Date,
        default:Date.now
    }
});
TradeMarkSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
mongoose.model('TradeMark',TradeMarkSchema);