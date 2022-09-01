import React from "react";

export interface options {
    cb?: Function,
    data?: Record<string, any>,
    queryParam?: Record<string, any>,
}

export interface apiParam {
    url: string,
    method: string,
    options?: options,
}

export interface CardProps {
    image?: string,
    productName: string,
    price: string,
    productId: number | string,
}

export interface FormStateObject {
    productName: string,
    description: string,
    imageUrl: string,
    category: string,
    price: string
}
export interface validationFunction {
    errors: FormStateObject,
    isValid: boolean,
}
export interface Product {
    avatar?: string
    category?: string
    createdAt?: string
    description?: string
    developerEmail?: string
    name?: string
    price?: number
    updatedAt?: string
    __v?: number
    _id?: string
}
export interface Category {
    createdAt: string
    name:string
    updatedAt: string
    __v: number
    _id: string
}


export type ChangeEvent = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>;

/*
avatar: "https://m.media-amazon.com/images/I/61EXU8BuGZL._SX679_.jpg"
category: "Electronics"
createdAt: "2022-08-15T05:29:23.111Z"
description: "test"
developerEmail: "gupta24pratibha@gmail.com"
name: "speaker"
price: 200
updatedAt: "2022-08-15T05:29:23.111Z"
__v: 0
_id: "62f9d9b39bdf582b9a133fd0"
*/
