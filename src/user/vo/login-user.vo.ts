interface UserInfo {
    id: number;

    email: string;

    username: string;

    avatar?: string;

    project: string[];
}

export class LoginUserVo {
    userInfo: UserInfo;

    accessToken: string;
}
