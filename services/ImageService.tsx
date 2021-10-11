import Firebase from 'services/firebase/Firebase';

export default class ImageService {
  constructor() {
    this.firebase = new Firebase();
  }

  async saveImageToServer(file) {
    let imageUrl = `images/blog/${file.name}`;
    const imageRef = this.firebase.storage.ref(imageUrl);
    await imageRef.put(file);
    const imageLink = await imageRef.getDownloadURL();
    return imageLink;
  }

  async editBlogPost(id, doc, mainCategories, categories) {
    try {
      const dateCreated = new Date(Date.now());
      let data = {...doc, mainCategories, categories, dateCreated};

      // If the main image has a name property, it means it's a new image to be replace the old one
      if (data.mainImage.name) {
        // Remove old image from storage
        let oldImage = data.oldImage[0];
        oldImage = oldImage.substring(
          oldImage.lastIndexOf('%2F') + 3,
          oldImage.lastIndexOf('?'),
        );
        const deleteRef = this.firebase.storage.ref(`images/blog/${oldImage}`);
        deleteRef.delete();

        let thumbnailImage = data.mainImage;
        data.mainImage = '';
        let imageUrl = `images/blog/${thumbnailImage.name}`;
        const imageRef = this.firebase.storage.ref(imageUrl);
        await imageRef.put(thumbnailImage);
        let imageLink = await imageRef.getDownloadURL();
        data.mainImage = imageLink;
      }
      // Remove the oldImage property so it isn't sent to the db
      delete data.oldImage;
      this.firebase.db.collection('BlogPosts').doc(id).update(data);
      return 'Success';
    } catch (error) {
      console.error(error);
      return 'Error';
    }
  }
}
