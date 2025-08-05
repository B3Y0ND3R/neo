import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";

const initialState ={
    isAuthenticated:false,
    isLoading:true,
    user:null,
};

const dispatch =useDispatch();

export const regUser = createAsyncThunk(
    "/auth/reg",
    async (formdata) => {
        const response= await axios.post("http://localhost:5000/api/auth/reg",
            formdata,
            { withCredentials: true, }
        );
        return response.data;
    }
);


export const loginUs= createAsyncThunk(
    "/auth/in",
    async(formdata) => {
    const response= await axios.post("http://localhost:500/auth/in", formdata, { withCredentials:true, }
    );

return response.data;
    }
);


export const logoutUs=createAsyncThunk(
    "/auth/out",
    async() => {
        const response = await axios.post("http://localhost:5000/auth/out", {});
        return response.data;
    }
);


const authSlice=createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser:(state, action) =>{},
    },
    extraReducers:(builder)=>{
        builder
        .addCase(regUser.pending, (state)=>{
            state.isLoading=true;
        })
        .addCase(regUser.fulfilled, (state, action)=>{
            state.isLoading=false;
            state.isAuthenticated=true;
            state.user=action.payload.sucess ? action.payload.user : null;
        })
        .addCase(regUser.rejected, (state, action)=>{
            state.isloading=false;
            state.isAuthenticated=false;
            state.user=null;
        })
        
    },
});


<Button onClick={()=>setOpen(true)} className="lg:hidden sm:block"> 
    <AlignJustify />
    <span className="sr-only">Toggle Menu</span>
</Button>


function handleLogout(){
 dispatch(logoutUs()).then(response=>{
    if(response?.payload?.sucess){
        window.location.href="/auth/login";
    }
 });
}



