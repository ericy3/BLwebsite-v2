import React, {useEffect, useState} from "react";
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
    const [allFiles, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const [uploadSuccessful, setUploadSuccessful] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/photos")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setFiles(data);
        })
    }, [uploadSuccessful]);


    const fileSelected = (e) => {
        setSelectedFile(e.target.files);
        setIsSelected(true);
    }

    const onFileUpload = e => {
        setShowLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile, selectedFile.name);
        fetch("http://127.0.0.1:8000/photos", {
            method: "POST",
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            setUploadSuccessful(!uploadSuccessful);
            setShowLoading(false);
        })
    }


    return (
        <div className = 'body'>
            <Nav></Nav>
                <div>
                    Input your Files Here
                    <input 
                    type='file' 
                    onChange={fileSelected}
                    />
                    <button 
                    onClick={onFileUpload}
                    isDisabled={!isSelected}
                    >
                    Upload
                    </button>
                    {/* <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple /> */}
                </div>
                {/* <UploadedFileNames allfiles={allFiles}></UploadedFileNames> */}
            <Footer></Footer>
        </div>
    );
} 

export default FileUpload