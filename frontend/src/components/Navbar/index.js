import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { toLogout } from "../../redux/reducers/auth";
import { useSelector, useDispatch } from "react-redux";
import { addPosts, setPosts } from "../../redux/reducers/posts";

const Navbar = () => {
  // instance
  const dispatch = useDispatch();
  const history = useNavigate();

  // useState
  const [firstName, setFirstName] = useState("");
  const [names, setNames] = useState("");
  const [status, setStatus] = useState(false);
  const [addPost, setAddPost] = useState(false);
  const [media, setMedia] = useState("");
  const [description, setDescrption] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  //request to server
  const searchBox = () => {
    axios
      .post(`http://localhost:5000/register/search`, { firstName })
      .then((result) => {
        setNames(result.data.users);
        setStatus(true);
        setAddPost(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userProfile = () => {
    axios
      .get(`http://localhost:5000/register/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   function create new post
  const createNewPost = () => {
    axios
      .post(
        `http://localhost:5000/post`,
        { media, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        dispatch(addPosts(result.data));
        setAddPost(false);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  //handle onChange event
  const handleOnChange = (e) => {
    e.preventDefault();
    setFirstName(`%${e.target.value}%`);
  };
  // data from store
  const { token } = useSelector((state) => {
    return {
      token: state.auth.token,
    };
  });

  // logout function
  const logout = () => {
    dispatch(toLogout());
    history("/");
  };

  return (
    <div className="nav_header">
      {" "}
      <div className="navbar">
        {token ? (
          <>
            <Link
              className="Link"
              to="/profile"
              onClick={() => {
                userProfile();
              }}
            ></Link>

            <Link className="Link" to="/home">
              Home
            </Link>

            <div>
              <div className="search_bar">
                <input
                  type="search"
                  list="users"
                  placeholder="Search"
                  onChange={handleOnChange}
                />

                <button
                  onClick={() => {
                    searchBox();
                  }}
                >
                  search
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setAddPost(true);
                setStatus(false);
              }}
            >
              add
            </button>
            <div
              className="add_poster"
              style={{ display: addPost ? "block" : "none" }}
            >
              <div className="post_input">
                <button
                  onClick={() => {
                    setAddPost(false);
                  }}
                >
                  close
                </button>

                <input
                  type="text"
                  placeholder="Add Media"
                  onChange={(e) => setMedia(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Add descrption"
                  onChange={(e) => setDescrption(e.target.value)}
                />
                <button onClick={createNewPost}>Add Post </button>
              </div>
            </div>

            <button className="logout" onClick={() => logout()}>
              Logout
            </button>
          </>
        ) : (
          <>
            {" "}
            <Link className="Link" to="/">
              Login
            </Link>
            <Link className="Link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
      <div
        className="search_popup"
        style={{ display: status ? "block" : "none" }}
      >
        <button
          className="search_b"
          onClick={() => {
            setStatus(false);
          }}
        >
          close
        </button>
        {names ? (
          <>
            {names.map((user, index) => {
              return (
                <div key={index} className="search_user">
                  <img className="p_pic" src={user.ProfilePicture} />
                  <p>{`${user.firstName} ${user.lastName}`}</p>
                </div>
              );
            })}{" "}
          </>
        ) : (
          []
        )}
      </div>
    </div>
  );
};

export default Navbar;
