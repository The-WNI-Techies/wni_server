interface IUser {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: 'F' | 'M';
    short_id: string;
    profile_image_uri: string;
}

type Bio = Pick<IUser, 'firstName'| 'lastName' | 'age' | 'gender'>
export default IUser;