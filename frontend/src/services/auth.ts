import {Amplify} from 'aws-amplify';
import {signIn,signOut,signUp,confirmSignUp,fetchAuthSession,getCurrentUser} from 'aws-amplify/auth';
const configured=Boolean(import.meta.env.VITE_COGNITO_USER_POOL_ID&&import.meta.env.VITE_COGNITO_CLIENT_ID);
if(configured) Amplify.configure({Auth:{Cognito:{userPoolId:import.meta.env.VITE_COGNITO_USER_POOL_ID,userPoolClientId:import.meta.env.VITE_COGNITO_CLIENT_ID}}});
export const cognitoConfigured=()=>configured;
export async function cloudSignIn(email:string,password:string){const result=await signIn({username:email,password});if(!result.isSignedIn) throw new Error('Additional sign-in step required. Check Cognito app client configuration.');const [auth,user]=await Promise.all([fetchAuthSession(),getCurrentUser()]);const token=auth.tokens?.idToken;if(!token)throw new Error('Cognito did not return an ID token.');const groups=(token.payload['cognito:groups'] as string[]|undefined)||[];return {id:user.userId,name:String(token.payload.name||email.split('@')[0]),email,role:(groups.includes('admins')?'admin':'student') as 'admin'|'student'};}
export async function cloudSignUp(name:string,email:string,password:string){return signUp({username:email,password,options:{userAttributes:{email,name}}})}
export async function cloudConfirmSignUp(email:string,code:string){return confirmSignUp({username:email,confirmationCode:code})}
export async function currentIdToken(){if(!configured)return null;const session=await fetchAuthSession();return session.tokens?.idToken?.toString()||null}
export async function cloudSignOut(){await signOut()}
