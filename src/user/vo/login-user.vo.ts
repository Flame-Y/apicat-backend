interface UserInfo {
    id: number;

    username: string;

    project: string[];
}

export class LoginUserVo {
    userInfo: UserInfo;

    accessToken: string;
}
