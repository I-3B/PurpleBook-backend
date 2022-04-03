import path from "path";
import request from "supertest";
import app from "../../app";
const getUser = (userId: String, token: String, status: Number) => {
    return request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const editUser = (edit: String, userId: String, token: String, status: Number) => {
    return request(app)
        .patch(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("firstName", `${edit}`)
        .field("lastName", `${edit}`)
        .expect(status);
};
const editUserWithImage = (
    edit: String,
    userId: String,
    token: String,
    image: string,
    status: Number
) => {
    return request(app)
        .patch(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("firstName", `${edit}`)
        .field("lastName", `${edit}`)
        .attach("image.png", path.join(__dirname, image))
        .expect(status);
};
const deleteUser = (userId: String, token: String, status: Number) => {
    return request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const getUserPosts = (userId: String, token: String, status: Number) => {
    return request(app)
        .get(`/api/users/${userId}/posts`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const getUserComments = (userId: String, token: String, status: Number) => {
    return request(app)
        .get(`/api/users/${userId}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const addFriendRequest = (userId: String, token: String, status: Number) => {
    return request(app)
        .post(`/api/users/${userId}/friend_requests`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const getFriendRequests = (userId: String, token: String, status: Number) => {
    return request(app)
        .get(`/api/users/${userId}/friend_requests`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const setFriendRequestsAsViewed = (userId: String, token: String, status: Number) => {
    return request(app)
        .patch(`/api/users/${userId}/friend_requests`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const deleteFriendRequest = (
    userId: String,
    token: String,
    friendRequestId: String,
    status: Number
) => {
    return request(app)
        .delete(`/api/users/${userId}/friend_requests/${friendRequestId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const acceptFriendRequest = (userId: String, token: String, friendId: String, status: Number) => {
    return request(app)
        .post(`/api/users/${userId}/friends/${friendId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const getFriends = (userId: String, token: String, status: Number) => {
    return request(app)
        .get(`/api/users/${userId}/friends`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
const deleteFriend = (userId: String, token: String, friendId: String, status: Number) => {
    return request(app)
        .delete(`/api/users/${userId}/friends/${friendId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(status);
};
export {
    getUser,
    editUser,
    editUserWithImage,
    deleteUser,
    getUserPosts,
    getUserComments,
    addFriendRequest,
    getFriendRequests,
    setFriendRequestsAsViewed,
    deleteFriendRequest,
    acceptFriendRequest,
    getFriends,
    deleteFriend,
};
