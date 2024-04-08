import { Schema, model, models, Document } from "mongoose";

// Define the interface for the interactions
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; //reference to user
  action: string;
  question: Schema.Types.ObjectId; //reference to questions
  answer: Schema.Types.ObjectId; // reference to answer
  tags: Schema.Types.ObjectId[]; // reference to tag
  createdAt: Date;
}

// Define the schema for the Interaction
const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  // Ek user ka ek time pe ek hei question ke sath interaction hoga isliye hum single question ki id ko store kar rahe hai jike sath bhi user interact karega, i.e.; Yaha pe One-to-One relation hoga
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  //   Same way answer ke sath bhi hoga, eg: agar user kisi answer ko ek baar seen karta hai toh usko hum uski answer ObjectIds mai ek hei baar store karenge
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }], //yaha pe humne tags ki multiple objectId store kari hai kyuki ek question mai multiple tags ho sakte hai isliye idhar One-to-Many Relation ho raha hai, lekin answer and question wale case mai aesa nahi hai, udhar 1 answer mai multiple answer nahi honge, na hei ek question mai multiple questions
  createdAt: { type: Date, default: Date.now },
});

// Create and export the Interaction model
const Interaction =
  models.Interaction || model("Interaction", InteractionSchema); //using this line we are first check if the Interaction models already exist in DB or not, and if it exist the we are going to create it
export default Interaction;

/* //!Note: Agar aap Schema.Types.ObjectId[] ko use karte hain, matlab ek array of ObjectIds, to har ek interaction ke liye multiple questions, answers, ya tags ho sakte hain. Iska use tab kiya jata hai jab ek interaction multiple questions, answers, ya tags ke saath associated ho sakta hai. Lekin, agar aapko har ek interaction ke sirf ek hi question, answer, ya tag ke saath association chahiye, to aap Schema.Types.ObjectId ka use karenge. Iska matlab hai ki har interaction ke sirf ek hi question, answer, ya tag ke saath association hoga. Ismein ek-to-ek relationship hoti hai. Aapke application ke requirements ke according, aap dono options mein se kisi ek ko choose kar sakte hain. Agar har ek interaction ke saath sirf ek hi question, answer, ya tag associated hai, to aap Schema.Types.ObjectId ka use karenge. Agar har ek interaction ke saath multiple questions, answers, ya tags associated hain, to aap Schema.Types.ObjectId[] ka use karenge.
 */
