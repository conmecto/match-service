const getAge = (date: string): number => {
    const dob = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

const getChatSocketKey = (matchId: string, userId: string) => {
    return `${matchId}:${userId}`;
}

export { getAge, getChatSocketKey }