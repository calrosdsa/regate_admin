class UtilImpl implements Util {
    redirectToLoginPage(){
        if(typeof window != 'undefined'){
            // deleteCookie("_auth")
            window.location.replace(window.location.origin + `/auth/login?redirect=${window.location.href}`)
        }
    }
}

export default UtilImpl;