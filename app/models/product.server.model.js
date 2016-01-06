/**
 * Created by Administrator on 1/5/2016.
 */
/**
 * Created by Tommy_Phan on 21/11/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
    title: {
        type : String,
        trim : true,
        require : true
    },
    trademark: {
        type : String,
        trim : true,
        default:''
    },
    year : Date,
    color : {
        type : String,
        trim : true,
        default:''
    },
    currentprice : {
        type : Number,
        require : true
    },
    oldpricegua: {
        gua : {
            type: Number,
            default: 0
        },
        nongua : {
            type: Number,
            default: 0
        }
    },
    galleryproduct : {
        type: Array,
        default: []
    },
    description: {
        type : String,
        trim : true,
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
ProductSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
mongoose.model('Product',ProductSchema);