import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		const atlasURL = "mongodb+srv://iamarjun537:badarni143@expresschatdb.mgcnrue.mongodb.net/?retryWrites=true&w=majority&appName=expresschatdb"
		await mongoose.connect(atlasURL);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;