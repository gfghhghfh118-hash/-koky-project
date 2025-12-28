"use server";

export async function testAction() {
    console.log("TEST ACTION CALLED ON SERVER");
    return { success: true, message: "Server connection confirmed!" };
}
