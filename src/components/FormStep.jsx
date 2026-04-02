export default function FormStep({ step, formData, setFormData }) {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (step === 1) {
        return (
            <>
                <div className="section-title">Personal Information</div>

                <div className="form-grid">
                    <div>
                        <label>First Name *</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Surname *</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Mother's Name</label>
                        <input name="motherName" value={formData.motherName} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Father's Name</label>
                        <input name="fatherName" value={formData.fatherName} onChange={handleChange} />
                    </div>
                </div>
            </>
        );
    }

    if (step === 2) {
        return (
            <>
                <div className="section-title">Birth Details</div>

                <div className="form-grid">
                    <div>
                        <label>Date of Birth *</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Time of Birth</label>
                        <input type="time" name="tob" value={formData.tob} onChange={handleChange} />
                    </div>

                    <div className="full">
                        <label>Place of Birth</label>
                        <input name="hospital" value={formData.hospital} onChange={handleChange} />
                    </div>
                </div>
            </>
        );
    }

    if (step === 3) {
        return (
            <>
                <div className="section-title">Review & Confirmation</div>

                <div className="review">
                    {Object.entries(formData).map(([key, value]) => (
                        <p key={key}>
                            <strong>{key}:</strong> {value || "-"}
                        </p>
                    ))}
                </div>
            </>
        );
    }
}