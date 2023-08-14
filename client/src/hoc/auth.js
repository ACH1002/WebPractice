import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';


const Auth = (SpecificComponent, option, adminRoute = null) => {
  //option의 종류는 3가지
  //1. null   => 아무나 출입이 가능한 페이지
  //2. true   => 로그인을 한 유저만 출입 가능한 페이지
  //3. false  => 로그인을 한 유저는 출입 불가능한 페이지
  //만약 adminRoute에 true를 줄 경우에는 관리자만 출입 가능한 페이지
  function AuthenticationCheck(){
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {

      dispatch(auth()).then(response => {
        console.log(response)
        //로그인 하지 않은 상태
        if(!response.payload.isAuth){

          //로그인 하지 않은 상태에서 로그인 한 유저 전용 페이지에 들어가려고 하는 경우
          if(option){
            navigate('/login')
          }
        } else {
          //로그인 한 상태

          //어드민이 아닌데 어드민 전용 페이지에 들어가려고 하는 경우
          if(adminRoute && !response.payload.isAdmin){
            navigate('/')
          } else {
            //로그인 한 유저가 로그인 하지 않은 유저 전용 페이지에 들어가려고 하는 경우
            if(option === false){
              navigate('/')
            }
          }
        }
      })

    }, [])

    return (
      <SpecificComponent/>
    )
  }

  return AuthenticationCheck

}

export default Auth










