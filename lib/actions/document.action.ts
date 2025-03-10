'use server'

import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import Document from "../models/document.model";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function fetchDocumentsByUserId(userId: string, type:string) {
    try {
      await connectToDB();
      
      const objectId = new mongoose.Types.ObjectId(userId);
      const documents = await Document.find({ userId: objectId, type });
      
      return documents;
    } catch (error: any) {
      throw new Error(`Failed to fetch documents for user: ${error.message}`);
    }
  }

export async function fetchDocument(doc_id: string, userId:string="") {
  try {
    connectToDB();
    let doc= await Document.findOne({id:doc_id})
    if(doc) return doc;

    const currentDate=new Date()
    doc= await Document.create({id:doc_id, data:"", userId, type:"text", imgUrl:"", title:`New Document ${currentDate}-${userId}`, description:"This is a new document"})
    await User.findByIdAndUpdate(userId, {$push:{document:doc._id}})
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchProject(project_id: string, userId:string="") {
  try {
    connectToDB();
    let project= await Document.findOne({id:project_id})
    // if(project) return {id:project.id};
    if(project) return {id:project.id,title:project.title,desc:project.description};

    const currentDate=new Date()
    project= await Document.create({id:project_id, data:"", userId, type:"code", imgUrl:"", title:`New Project ${currentDate}-${userId}`, description:"This is a new Project"})
    await User.findByIdAndUpdate(userId, {$push:{projects:project._id}})
    // return project.id
    return {id:project.id,title:project.id,desc:project.description}
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}


export async function updateDocumentPermission(doc_id: string, accessEmail: any, isPublic: boolean) {
  try {
    console.log(accessEmail)
    await connectToDB(); 
    const doc = await Document.findOneAndUpdate(
      { id: doc_id },
      {allowedUsers:accessEmail},
      { new: true }
    );
    if(!doc){
      throw new Error("Document not found");
    }
  } catch (error: any) {
    throw new Error(`Failed to update document: ${error.message}`);
  }
}

export async function updateDocumentTitleDescription(doc_id: string, title: string, description: string) {
  try {
    await connectToDB(); // Ensure the database connection is established
    await Document.findOneAndUpdate(
      { id: doc_id },
      {title, description},
      { new: true }
    );
  } catch (error: any) {
    throw new Error(`Failed to update document: ${error.message}`);
  }
}

export async function updateProjectTitleDescription(project_id: string, title: string, description: string) {
  try {
    await connectToDB(); 
    await Document.findOneAndUpdate(
      { id: project_id },
      {title, description},
      { new: true }
    );
  } catch (error: any) {
    throw new Error(`Failed to update document: ${error.message}`);
  }
}

export async function deleteDocument(doc_id: string) {
  try {
    await connectToDB(); // Ensure the database connection is established
    await Document.findOneAndDelete({id:doc_id});
  } catch (error: any) {
    throw new Error(`Failed to update document: ${error.message}`);
  }
}