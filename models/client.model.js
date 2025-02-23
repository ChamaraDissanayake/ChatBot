const clientSchema = {
  name: String,
  phoneNumber: String, // Unique identifier
  isActive: { type: Boolean, default: true },
  chatHandover: { type: Boolean, default: false }, // New field for handover status
};
export default clientSchema;