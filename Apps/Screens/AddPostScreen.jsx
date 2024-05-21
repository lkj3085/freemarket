import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";

export default function AddPostScreen() {
  const { user } = useUser();

  const db = getFirestore(app);
  const storage = getStorage();
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmitMethod = async (value) => {
    setLoading(true);
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, `communityPost/` + Date.now() + ".jpg");

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("업로드 완료");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          value.image = downloadUrl;
          value.userName = user.fullName;
          value.userEmail = user.primaryEmailAddress.emailAddress;
          value.userImage = user.imageUrl;

          const docRef = await addDoc(collection(db, "UserPost"), value);
          if (docRef.id) {
            setLoading(false);
            Alert.alert("작성완료");
          }
        });
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "height" : "padding"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>프리마켓</Text>
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            address: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            userImage: "",
            createdAt: Date.now(),
          }}
          onSubmit={(value) => onSubmitMethod(value)}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.name = "제목을 입력하세요";
            }
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
          }) => (
            <View style={styles.form}>
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <Image
                    source={require("../../assets/images/picture.png")}
                    style={styles.imagePlaceholder}
                  />
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="제목"
                value={values?.title}
                onChangeText={handleChange("title")}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="내용"
                value={values?.desc}
                numberOfLines={5}
                onChangeText={handleChange("desc")}
              />
              <TextInput
                style={styles.input}
                placeholder="가격"
                value={values?.price}
                keyboardType="number-pad"
                onChangeText={handleChange("price")}
              />
              <TextInput
                style={styles.input}
                placeholder="거래 위치"
                value={values?.address}
                onChangeText={handleChange("address")}
              />
              <Picker
                selectedValue={values?.category}
                onValueChange={(itemValue) =>
                  setFieldValue("category", itemValue)
                }
                style={styles.picker}
              >
                {categoryList &&
                  categoryList.map((item, index) => (
                    <Picker.Item
                      key={index}
                      label={item?.name}
                      value={item?.name}
                    />
                  ))}
              </Picker>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.submitButton,
                  { backgroundColor: loading ? "#ccc" : "#FF8C00" },
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>작성완료</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  imagePicker: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 400,
    height: 400,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginVertical: 10,
  },
  submitButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
// import { app } from "../../firebaseConfig";
// import { useEffect, useState } from "react";
// import { Formik } from "formik";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// import { useUser } from "@clerk/clerk-expo";

// export default function AddPostScreen() {
//   const { user } = useUser();

//   const db = getFirestore(app);
//   const storage = getStorage();
//   const [categoryList, setCategoryList] = useState([]);
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     getCategoryList();
//   }, []);

//   const getCategoryList = async () => {
//     setCategoryList([]);
//     // setCategoryList([]);
//     const querySnapshot = await getDocs(collection(db, "Category"));

//     querySnapshot.forEach((doc) => {
//       // console.log("Docs", doc.data());
//       setCategoryList((categoryList) => [...categoryList, doc.data()]);
//     });
//   };

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 4],
//       quality: 1,
//     });

//     console.log(result);

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const onSubmitMethod = async (value) => {
//     setLoading(true);
//     // convert uri to blub file
//     const resp = await fetch(image);
//     const blob = await resp.blob();
//     const storageRef = ref(storage, `communityPost/` + Date.now() + ".jpg");

//     uploadBytes(storageRef, blob)
//       .then((snapshot) => {
//         console.log("업로드 완료");
//       })
//       .then((resp) => {
//         getDownloadURL(storageRef).then(async (downloadUrl) => {
//           console.log(downloadUrl);
//           value.image = downloadUrl;
//           value.userName = user.fullName;
//           value.userEmail = user.primaryEmailAddress.emailAddress;
//           value.userImage = user.imageUrl;

//           const docRef = await addDoc(collection(db, "UserPost"), value);
//           if (docRef.id) {
//             setLoading(false);
//             Alert.alert("작성완료");
//           }
//         });
//       });
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "android" ? "height" : "padding"}
//     >
//       <ScrollView className="p-10 bg-white">
//         <Text className="text-[27px] font-bold">프리마켓</Text>
//         <Formik
//           initialValues={{
//             title: "",
//             desc: "",
//             category: "",
//             address: "",
//             price: "",
//             image: "",
//             userName: "",
//             userEmail: "",
//             userImage: "",
//             createdAt: Date.now(),
//           }}
//           onSubmit={(value) => onSubmitMethod(value)}
//           validate={(values) => {
//             const errors = {};
//             if (!values.title) {
//               errors.name = "제목을 입력하세요";
//             }
//             return errors;
//           }}
//         >
//           {({
//             handleChange,
//             handleBlur,
//             handleSubmit,
//             values,
//             setFieldValue,
//           }) => (
//             <View className="mt-4">
//               <TouchableOpacity onPress={pickImage}>
//                 {image ? (
//                   <Image
//                     source={{ uri: image }}
//                     style={{ width: 100, height: 100, borderRadius: 1 }}
//                   />
//                 ) : (
//                   <Image
//                     source={require("../../assets/images/picture.png")}
//                     style={{ width: 100, height: 100, borderRadius: 1 }}
//                   />
//                 )}
//               </TouchableOpacity>
//               <TextInput
//                 style={styles.input}
//                 placeholder="제목"
//                 value={values?.title}
//                 onChangeText={handleChange("title")}
//               />
//               <TextInput
//                 style={[styles.input, { padding: 45 }]}
//                 placeholder="내용"
//                 value={values?.desc}
//                 numberOfLines={5}
//                 onChangeText={handleChange("desc")}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="가격"
//                 value={values?.price}
//                 keyboardType="number-pad"
//                 onChangeText={handleChange("price")}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="거래 위치"
//                 value={values?.address}
//                 onChangeText={handleChange("address")}
//               />
//               <Picker
//                 selectedValue={values?.category}
//                 onValueChange={(itemValue) =>
//                   setFieldValue("category", itemValue)
//                 }
//               >
//                 {categoryList &&
//                   categoryList.map((item, index) => (
//                     <Picker.Item
//                       key={index}
//                       label={item?.name}
//                       value={item?.name}
//                     />
//                   ))}
//               </Picker>

//               <TouchableOpacity
//                 onPress={handleSubmit}
//                 className="p-4 bg-blue-500 rounded-full mt-10"
//                 style={{ backgroundColor: loading ? "#ccc" : "#008BFF" }}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text className="text-white text-center text-[16px]">
//                     작성완료
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           )}
//         </Formik>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   input: {
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     marginTop: 10,
//     marginBottom: 5,
//     paddingHorizontal: 17,
//     fontSize: 17,
//     textAlignVertical: "top",
//   },
// });
