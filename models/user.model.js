    import mongoose from "mongoose";

    const userSchema = new mongoose.Schema(
        {
            fullName: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
                required: true,
            },
            phoneNumber: {
                type: Number,
                required: true,
            },
            role: {
                type: String,
                enum: ["admin", "user"],
                default: "user",
            },
            profilePhoto: {
                type: String,
                default: "",
            },
            verifyOtp: {type: String, default:""},
            verifyOtpExpiresAt: {type: Number, default: 0},
            isAccountVerified: {type: Boolean, default: false},
        },
        { timestamps: true }
    );

    export  const User = mongoose.model("User", userSchema);

    export default userSchema;
