import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

const toBase64 = (image) =>
  new Promise((resolve, reject) => {
    const blob = new Blob([image], { type: 'text/plain' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const useStyles = makeStyles((theme) => ({
  titleBar: {
    color: "white",
    textAlign:"center",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  container:{
    backgroundColor: "#FF7373",
    padding:  theme.spacing(10),
  },
  formWrapper:{
    backgroundColor: 'white',
    boxShadow: "8px 6px 20px -6px rgba(0,0,0,0.72);",
    width: '500px',
    borderRadius: "20px",
    padding:  theme.spacing(2),
    margin: "auto"
  },
  wrapper: {
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(3),
  },
  label: {
    width: '15%',
    marginRight: theme.spacing(4),
    textAlign: 'right',
    color: "#FF7373",
  },
  select: {
    flex: '1',
    marginRight: theme.spacing(3),
  },
  image: {
    width: '30%',
  },
  imageWrapper: {
    width: '80%',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(6),
  },
  button: {
    margin: theme.spacing(3),
    backgroundColor: "#FF7373",
    color:"white",
  },
}));

const validationSchema = yup.object({
  username: yup.string('Enter a user name').required('A user name is required'),
  email: yup.string('Enter your email').email('Enter a valid email').required('An email is required'),
  password: yup.string('Enter a password').min(8, 'Password should be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    `Password requires at least one lower case character one uppercase, 
    one digit and one special character`,
  )
  .required('Password is required'),
  gender:  yup.string('Choose a gender').required('Please select a gender'),
  image: yup
    .mixed()
    .test(
      'type',
      'Only the following formats are accepted: .jpeg, .jpg, .bmp, .pdf and .png',
      (value) => {
        if (!value) return true;
        return (
          value &&
          (value.type === 'image/jpeg' ||
            value.type === 'image/bmp' ||
            value.type === 'image/png' ||
            value.type === 'application/pdf')
        );
      },
    )
    .test('fileSize', 'The file is too large', (value) => {
      if (!value) return true;
      return value?.size <= 250 * 1024;
    }),
});

const UserForm = () => {
  const classes = useStyles();
  const [image, setImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      username:  '',
      email: '',
      password: '',
      gender:'',
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        gender: values.gender,
        image: values.image,
      };

      console.log('payload', payload);      
    },
  });

  const handleImageChange = async (e) => {
    formik.setFieldValue('image', e.currentTarget.files[0]);
    const formattedImage = await toBase64(e.currentTarget.files[0]);
    setImage(formattedImage);
  };

  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className={classes.container}>
    <Container maxWidth="lg">
      <div className={classes.titleBar}>
          <Typography variant="h4">
            Sign Up Here
          </Typography>
      </div>
      <Box className={classes.formWrapper}>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div className={classes.wrapper}>
          <Typography className={classes.label} variant="subtitle1">
           Username
          </Typography>
          <TextField
            name="username"
            variant="outlined"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
          />
        </div>
        <div className={classes.wrapper}>
          <Typography className={classes.label} variant="subtitle1">
            Email
          </Typography>
          <TextField
            name="email"
            variant="outlined"
            label="Email"
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </div>
        <div className={classes.wrapper}>
          <Typography className={classes.label} variant="subtitle1">
           Password
          </Typography>
          <TextField
            type="password"
            name="password"
            variant="outlined"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
          />
        </div>
        <div className={classes.wrapper}>
          <Typography className={classes.label} variant="subtitle1">
            Gender
          </Typography>
          <TextField  
            id="select"
            select
            variant="outlined"
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            error={formik.touched.gender && !!formik.errors.gender}
            helperText={formik.touched.gender && formik.errors.gender}
          >
            {genders.map((gender) => (
              <MenuItem key={`gender${gender}`} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className={classes.wrapper}>
          <Typography className={classes.label} variant="subtitle1">
            Image
          </Typography>
          <Box className={classes.imageWrapper}>
            {image && (
              <>
                <img className={classes.image} src={image} alt="test" />
                <Typography gutterBottom>{formik.values.image.name}</Typography>
              </>
            )}

            <TextField
              type="file"
              accept="image/*"
              id="image"
              name="image"
              variant="outlined"
              placeholder="Select an image"
              error={formik.touched.image && !!formik.errors.image}
              helperText={formik.touched.image && formik.errors.image}
              onChange={handleImageChange}
            />
          </Box>
        </div>
        <div className={classes.buttonWrapper}>
          <Button className={classes.button} type="submit" size="large" variant="outlined">
            Sign Up
          </Button>
        </div>
      </form>
      </Box>
    </Container>
    </div>
  );
};



export default UserForm;
