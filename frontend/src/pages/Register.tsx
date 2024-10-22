import { useState } from "react"

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNum: '',
        userType: 'Student',
        password: '',
        confirmPassword: ''
    })


    return(
        <div>
            <form>
                <label htmlFor="firstName">First Name</label>
                <input type="text" placeholder="Enter First Name" name="firstName" required />

                <label htmlFor="lastName">Last Name</label>
                <input type="text" placeholder="Enter Last Name" name="lastName" required />

                <label htmlFor="email">Email Address</label>
                <input type="text" placeholder="Enter Email Address" name="email" required />

                <label htmlFor="phoneNumber">Phone Number</label>
                <input type="text" placeholder="Enter Password" name="phoneNumber"/>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="Enter Password" name="password" required />

                <label htmlFor="confirmPassword">Password</label>
                <input type="password" placeholder="Enter Password" name="confirmPassword" required />
            </form>
        </div>
    )
}

export default Register