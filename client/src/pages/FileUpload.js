import React, {useState} from "react";
import Nav from '../components/navbar/Nav.js';
import Footer from '../components/Footer'
import './FileUpload.css';
import { FileUploader } from "react-drag-drop-files";

// const fileTypes = ["JPG", "PNG", "GIF"];

// export function UploadedFileNames(props) {
//     console.log(props.allfiles);
//     if (!props.allfiles) return null;
//     return ( 
//         <div>
//             {props.allfiles && props.allfiles.map((index) => 
//                 (               
//                  <li>props.allfiles[index].name</li>
//                 )
//             )}
//         </div>
//     )

// }
  



function FileUpload(props) {
    // const [file, setFile] = useState(null);
    // const handleChange = (file) => {
    //   setFile(file);
    // };
    // console.log(file);
    const [allFiles, setFiles] = useState([]);

    const fileSelected = (e) => {
        setFiles(e.target.files)
    }

    const uploadFiles = () => {
        const formData = new FormData()
        for (let i = 0; i < allFiles.length; i++) {
            formData.append(`image[${i}]`, allFiles[i])
        }
    }


    // const addFile = (file) => {
    //     setFiles([...files, file])
    // }
    return (
        <div className = 'body'>
            <Nav></Nav>
                <div>
                    Input your Files Here
                    <input 
                    type='file' 
                    onChange={fileSelected}
                    multiple
                    />
                    {/* <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple /> */}
                </div>
                {/* <UploadedFileNames allfiles={allFiles}></UploadedFileNames> */}
            <Footer></Footer>
        </div>
    );
} 

export default FileUpload