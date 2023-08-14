import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../_actions/user_action'
import Auth from '../../../hoc/auth';

function LoginPage() {

  const dispatch =useDispatch()
  const navigate = useNavigate()
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault() //Login버튼을 클릭할 경우 바로 refresh되는 것을 막기 위해서 사용 만약 사용 안할 시 바로 refresh됨

    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess){
          navigate('/')
        }else{
          alert('Failed Login')
        }
      })
  }

  return (
    <div style={{ 
      display:'flex', justifyContent:'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      
      <form style={{ display: 'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type='email' value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type='password' value={Password} onChange={onPasswordHandler} />
        <br />
        <button>
          Login
        </button>
      </form>


    </div>
  )
}

export default Auth(LoginPage, false)