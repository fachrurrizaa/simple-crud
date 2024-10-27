'use client'
import UserForm from '@/components/form/UserForm';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Page({ params: paramsPromise }) {
    const [params, setParams] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        paramsPromise.then(unwrappedParams => setParams(unwrappedParams));
    }, [paramsPromise]);

    useEffect(() => {
        if (params && params.username) {
            axios.get(`/api/user?username=${params.username}`)
                .then(response => setData(response.data))
                .catch(error => console.error(error));
        }
    }, [params]);

    return (
        <UserForm 
            id={data?.id}
            username={data?.username || ''}
            password={data?.password || ''}
            email={data?.email || ''}
            nama={data?.nama || ''}
        />
    );
}
