"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resetUser } from '@/features/User/user-slice';
import { useDispatch } from 'react-redux';
const LogoutPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const logout = async () => {
            dispatch(resetUser());
            router.push('/');
        };

        logout();
    }, [router]);

    return null;
};

export default LogoutPage;
