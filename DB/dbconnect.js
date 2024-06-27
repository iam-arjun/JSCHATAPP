import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		const dbUrl = "mongodb+srv://iamarjun537:badarni143@expresschatdb.mgcnrue.mongodb.net/?retryWrites=true&w=majority&appName=expresschatdb"
		// const dbUrl = 'mongodb://localhost:27017/jschatdb'
		await mongoose.connect(dbUrl);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;