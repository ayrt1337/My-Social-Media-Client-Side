import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../login'
import Register from '../register'
import ConfirmEmail from '../confirmEmail'
import VerifyEmail from '../verifyEmail'
import ResetPassword from '../resetPassword'
import VerifyPassword from '../verifyPasswordEmail'
import ConfirmEmailPassword from '../confirmPasswordEmail'
import Home from '../homePage'
import NewUser from '../newUser'
import Profile from '../profile'
import PageNotFound from '../pageNotFound'
import Post from '../postDetails'
import Notifications from '../notifications'

const AppRoutes = () => {
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/login' element={<Login />}></Route>
                    <Route exact path='/register' element={<Register />}></Route>
                    <Route exact path='/confirmemail' element={<ConfirmEmail />}></Route>
                    <Route exact path='/verifyemail' element={<VerifyEmail />}></Route>
                    <Route exact path='/reset' element={<ResetPassword />}></Route>
                    <Route exact path='/verifypassword' element={<VerifyPassword />}></Route>
                    <Route exact path='/confirmemailpassword' element={<ConfirmEmailPassword />}></Route>
                    <Route exact path='/home' element={<Home />}></Route>
                    <Route exact path='/newUser' element={<NewUser />}></Route>
                    <Route exact path='/profile/:user' element={<Profile />}></Route>
                    <Route exact path='/post/:id' element={<Post />}></Route>
                    <Route exact path='/notifications' element={<Notifications />}></Route>
                    <Route exact path='*' element={<PageNotFound />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes