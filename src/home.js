import { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import image from "./bg.png";
import UploadDropzone from './components/UploadDropzone';
import PreviewMedia from './components/PreviewMedia';
import ResultsTable from './components/ResultsTable';
import LoaderMessage from './components/LoaderMessage';
import ErrorMessage from './components/ErrorMessage';
import ClearButtonBar from './components/ClearButtonBar';
import Clear from '@material-ui/icons/Clear';

const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "15px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: {
    height: 400,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "5em 1em 2em 1em",
  },
  mainContainer: {
    backgroundImage: `linear-gradient(rgba(34, 139, 34, 0.25), rgba(34, 139, 34, 0.25)), url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: "100vh",
    height: "auto",
    overflowY: "auto",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 420,
    minHeight: 520,
    backgroundColor: 'rgba(189, 236, 190, 0.85)',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15) !important',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  input: {
    display: 'none',
  },
  uploadIcon: {
    background: 'white',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '22px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#1b5e20 !important',
    fontWeight: 800,
    padding: '4px 24px 4px 16px',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#2e7d32 !important',
    fontWeight: 800,
    padding: '4px 24px 4px 16px',
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  text: {
    color: 'white !important',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "416px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  appbar: {
    background: '#be6a77',
    boxShadow: 'none',
    color: 'white'
  },
  loader: {
    color: '#2e7d32 !important',
  },
  error: {
    color: '#d32f2f',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '10px',
  }
}));
export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  let confidence = 0;
  const cancelSourceRef = useRef(null);

  const sendFile = useCallback(async () => {
    if (image && selectedFile) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          console.error("Upload error: REACT_APP_API_URL is not defined");
          setIsloading(false);
          setError("REACT_APP_API_URL is not defined");
          return;
        }
        setError(null);
        const transient = (status) => [502, 503, 504].includes(status);
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const source = axios.CancelToken.source();
            cancelSourceRef.current = source;
            const res = await axios.post(apiUrl, formData, {
              headers: { "Content-Type": "multipart/form-data" },
              cancelToken: source.token,
              timeout: 20000,
            });
            if (res.status === 200) {
              setData(res.data);
              break;
            }
          } catch (err) {
            const status = err?.response?.status;
            const isNetwork = !!err?.isAxiosError && !err?.response;
            if (attempt < 3 && (isNetwork || transient(status))) {
              await sleep(500 * attempt);
              continue;
            }
            throw err;
          } finally {
            cancelSourceRef.current = null;
          }
        }
      } catch (err) {
        console.error("Upload error:", err);
        const status = err?.response?.status;
        const message = status
          ? `Upload failed with status ${status}${err.response?.statusText ? ` ${err.response.statusText}` : ''}`
          : (err?.message || 'Upload failed');
        setError(message);
      } finally {
        setIsloading(false);
      }
    }
  }, [image, selectedFile]);

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview, sendFile]);

  useEffect(() => {
    return () => {
      if (cancelSourceRef.current) {
        cancelSourceRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      setError(null);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
    setError(null);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
       <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            CodeBasics: Potato Disease Classification
          </Typography>
          <div className={classes.grow} />
          
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && (
                <PreviewMedia src={preview} className={classes.media} title="Preview" />
              )}
              <CardContent className={classes.content} style={{ display: image ? 'none' : 'block' }}>
                <UploadDropzone
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag and drop an image of a potato plant leaf to process"}
                  onChange={onSelectFile}
                  hidden={false}
                />
              </CardContent>
              {data && (
                <CardContent className={classes.detail}>
                  <ResultsTable
                    label={data.class}
                    confidence={confidence}
                    classNames={{
                      tableContainer: classes.tableContainer,
                      table: classes.table,
                      tableHead: classes.tableHead,
                      tableRow: classes.tableRow,
                      tableCell: classes.tableCell,
                      tableCell1: classes.tableCell1,
                      tableBody: classes.tableBody,
                    }}
                  />
                </CardContent>
              )}
              {isLoading && (
                <LoaderMessage loaderClassName={classes.loader} titleClassName={classes.title} title="Processing" />
              )}
              {error && (
                <ErrorMessage message={error} className={classes.error} />
              )}
            </Card>
          </Grid>
          {data && (
            <ClearButtonBar onClear={clearData} buttonClassName={classes.clearButton} startIcon={<Clear fontSize="large" />} />
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
