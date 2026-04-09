/*
 * @name: Kary
 * @Date: 2025-09-22 16:09:20
 * @Description: 
 */

import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)