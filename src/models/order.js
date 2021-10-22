const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const OrderSchema = new mongoose.Schema({

    order_id: {
        type: String,
        required:true
    },

    first_name: {
        type: String,
        required: false
    },

    last_name: {
            type: String,
            required: false
    },

    state_id: {
        type: String,
        required: true
    },

}, {timestamps: true});


OrderSchema.plugin(aggregatePaginate);

module.exports = mongoose.model('checkouts', OrderSchema);
