import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ScrapSchema = new Schema({
  url: {
    type    : String,
    required: true,
    unique  : true
  },
  data: [{
    selector: String,
    target: String,
    result: [String]
  }]
});

const Scrap = mongoose.model('Scrap', ScrapSchema);

export default Scrap;