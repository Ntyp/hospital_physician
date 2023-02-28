import React, { useState, useEffect } from 'react';
import {
    IconFileDescription,
    IconBoxSeam,
    IconHome,
    IconUsers,
    IconFileX,
    IconFileCheck,
    IconFileImport,
    IconFileText,
    IconUserExclamation,
    IconClipboardText,
    IconCar,
    IconFlask
} from '@tabler/icons';

const icons = {
    IconFileDescription,
    IconBoxSeam,
    IconHome,
    IconUsers,
    IconFileX,
    IconFileCheck,
    IconFileImport,
    IconFileText,
    IconUserExclamation,
    IconClipboardText,
    IconCar,
    IconFlask
};
// const userData = localStorage.getItem('user_data');
// const user = JSON.parse(userData);
// const role = user.user_role;

const userData = localStorage.getItem('user_data');
let user;
if (userData && userData !== 'undefined') {
    try {
        user = JSON.parse(userData);
    } catch (error) {
        console.error('Error parsing user data: ', error);
    }
}
const role = user?.user_role;
let pages = {
    id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: []
};
if (role === 'hospital staff') {
    pages.children = [
        {
            id: 'home',
            title: 'หน้าหลัก',
            type: 'item',
            url: '/home',
            icon: icons.IconHome,
            target: true
        },
        {
            id: 'tracking',
            title: 'การนำส่งอุปกรณ์',
            type: 'item',
            url: '/tracking',
            icon: icons.IconBoxSeam,
            target: true
        },
        {
            id: 'documents',
            title: 'การนำส่งเอกสาร',
            type: 'item',
            url: '/documents',
            icon: icons.IconFileImport,
            target: true
        }
    ];
} else if (role === 'officer' || role === 'assistant' || role === 'director') {
    pages.children = [
        {
            id: 'home',
            title: 'หน้าหลัก',
            type: 'item',
            url: '/home',
            icon: icons.IconHome,
            target: true
        },
        {
            id: 'report-documents',
            title: 'รายงานเอกสาร',
            type: 'collapse',
            icon: icons.IconFileDescription,
            children: [
                {
                    id: 'report-documents',
                    title: 'รอการอนุมัติ',
                    type: 'item',
                    url: '/report-documents',
                    icon: icons.IconFileDescription,
                    target: true
                },
                {
                    id: 'report-documents-approve',
                    title: 'อนุมัติแล้ว',
                    type: 'item',
                    url: '/report-documents-approve',
                    icon: icons.IconFileCheck,
                    target: true
                },
                {
                    id: 'report-documents-disapproved',
                    title: 'ไม่อนุมัติ',
                    type: 'item',
                    icon: icons.IconFileX,
                    url: '/report-documents-disapproved',
                    target: true
                }
            ]
        }
    ];
} else if (role === 'admin') {
    pages.children = [
        {
            id: 'users',
            title: 'สมาชิก',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'user-edit',
                    title: 'จัดการสมาชิก',
                    type: 'item',
                    icon: icons.IconUserExclamation,
                    url: '/users',
                    target: true
                }
            ]
        }
    ];
}
export default pages;