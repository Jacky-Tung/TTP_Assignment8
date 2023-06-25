import "./App.css";
import { Badge, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import axios from "axios";
import { Form } from "react-bootstrap";

function App() {
  const [gifs, setGifs] = useState([]);
  const [randomGif, setRandomGif] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [random, setRandom] = useState(0);
  const [filter, setFilter] = useState([
    { rating: "g", filter: false },
    { rating: "pg", filter: false },
    { rating: "pg-13", filter: false },
    { rating: "r", filter: false },
  ]);
  const [unfilteredGifs, setUnFilteredGifs] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [unsortedGifs, setUnSortedGifs] = useState([]);

  /**
   * Fetching gifs based on searchInput,
   * Empty input -> get trending gifs
   * Not empty input -> get regular gifs
   * Rerenders depending on random and
   * searchInput value change which are
   * user search term and generate random gif
   * button
   */
  useEffect(() => {
    const fetchGifs = async () => {
      try {
        const res = await axios.get(
          `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=rI36MmIAU2YqEuB0GMDS63VcjSqugDDr`
        );
        setGifs(res.data.data);
        setUnFilteredGifs(res.data.data);
        setUnSortedGifs(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTrendingGifs = async () => {
      try {
        const res = await axios.get(
          `https://api.giphy.com/v1/gifs/trending?api_key=rI36MmIAU2YqEuB0GMDS63VcjSqugDDr`
        );
        setGifs(res.data.data);
        setUnFilteredGifs(res.data.data);
        setUnSortedGifs(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRandomGif = async () => {
      try {
        const res = await axios.get(
          `https://api.giphy.com/v1/gifs/random?api_key=rI36MmIAU2YqEuB0GMDS63VcjSqugDDr`
        );
        setRandomGif(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    /**
     * No user input will just display trending gifs
     * Clicking button will display just a random gif
     * User input will display regular gifs according to search term
     */
    if (random === 1) {
      /**
       * onClick toggles flag which is in the dependency array
       * thus this block of code will execute
       * and it resets the flag so that onClick will execute
       * the useEffect hook again
       */
      fetchRandomGif();
      setRandom(0);
    } else {
      /**
       * The value of random will always be 0 if
       * execution of useEffect hook is because
       * of searchInput onChange, which will toggle
       * the conditional flag for rendering
       */
      searchInput === "" ? fetchTrendingGifs() : fetchGifs();
    }
  }, [searchInput, random]);

  /**
   * onClick toggles flag
   */
  const generateRandomGif = () => {
    setRandom(1);
  };

  /**
   * Toggles conditional values so that
   * trending or regular gifs will be rendered
   * upon input change
   */
  const handleInputChange = (event) => {
    setRandomGif({});
    setSearchInput(event.target.value);
  };

  /**
   * On filter or originalGifs changes
   * Set gif to the latest fetched gifs
   * Filter latest fetched gifs depending on
   * options unchecked, else do nothing
   */
  useEffect(() => {
    const filterBy = (option) => {
      if (option.filter) {
        setGifs((prevGifs) =>
          prevGifs.filter((gif) => gif.rating !== option.rating)
        );
      }
    };

    setGifs(unfilteredGifs);

    filter.forEach((option) => {
      filterBy(option);
    });
  }, [filter, unfilteredGifs]);

  /**
   * On checkbox changes, toggle filter
   * objects' attribute so useEffect hook
   * will execute and rerender filtered gifs
   */
  const handleFilter = (event) => {
    setFilter((prevFilter) => {
      return prevFilter.map((option) => {
        if (option.rating === event.target.value) {
          return { ...option, filter: !option.filter };
        }
        return option;
      });
    });
  };

  /**
   * useEffect hook for sorting either by
   * latest or oldest based on select
   * Default will reset filters and render
   * the unsorted/unfiltered gifs that is
   * solely dependent on the first useEffect
   * hook which will execute on change of
   * search term value and random (irrelevant
   * for this hook)
   */
  useEffect(() => {
    const sortByLatest = () => {
      setGifs((prevGifs) =>
        [...prevGifs].sort((a, b) => {
          return new Date(b.import_datetime) - new Date(a.import_datetime);
        })
      );

      setUnFilteredGifs((prevUnFilteredGifs) =>
        [...prevUnFilteredGifs].sort((a, b) => {
          return new Date(b.import_datetime) - new Date(a.import_datetime);
        })
      );
    };

    const sortByOldest = () => {
      setGifs((prevGifs) =>
        [...prevGifs].sort((a, b) => {
          return new Date(a.import_datetime) - new Date(b.import_datetime);
        })
      );

      setUnFilteredGifs((prevUnFilteredGifs) =>
        [...prevUnFilteredGifs].sort((a, b) => {
          return new Date(a.import_datetime) - new Date(b.import_datetime);
        })
      );
    };

    if (sortBy === "latest") sortByLatest();
    if (sortBy === "oldest") sortByOldest();
    if (sortBy === "default") setGifs([...unsortedGifs]);
  }, [sortBy, unsortedGifs]);

  /**
   * Specifies which option to
   * sort by based on option selected
   */
  const handleSort = (event) => {
    if (event.target.value === "default") {
      setFilter([
        { rating: "g", filter: false },
        { rating: "pg", filter: false },
        { rating: "pg-13", filter: false },
        { rating: "r", filter: false },
      ]);
    }
    setSortBy(event.target.value);
  };

  return (
    <Container fluid className="App">
      <div className="main-content">
        <h1 className="title">
          <Badge bg="dark">Gifs From GIPHY API</Badge>
        </h1>
        <div className="search">
          <Form.Control
            onChange={handleInputChange}
            placeholder="Search for gifs"
            type="text"
            className="w-50 rounded"
          ></Form.Control>
        </div>
        <div className="randomGif">
          <Button variant="dark" size="md" onClick={generateRandomGif}>
            Click here for a random gif
          </Button>
        </div>
        <div className="center">
          <div className="menu">
            <div className="filter">
              <Form className="filtermenu">
                Filter By Rating
                <div className="filtermenu">
                  {filter.map((option) => (
                    <Form.Check
                      type="checkbox"
                      label={option.rating}
                      inline
                      value={option.rating}
                      onChange={handleFilter}
                      checked={!option.filter}
                      className="filtermenu"
                    ></Form.Check>
                  ))}
                </div>
              </Form>
            </div>
            <div className="sort">
              <Form.Select onChange={handleSort}>
                <option>Sort By</option>
                <option value="default">Default</option>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </Form.Select>
            </div>
          </div>
        </div>
        <div className="gifs">
          <Row className="g-4">
            <div className="center">
              {Object.keys(randomGif).length > 0 && (
                <Card style={{}}>
                  <Image src={randomGif.images.fixed_height.url}></Image>
                  <Card.Body>
                    <Card.Title>{randomGif.title}</Card.Title>
                  </Card.Body>
                </Card>
              )}
            </div>
            {Array.isArray(gifs) &&
              Object.keys(randomGif).length === 0 &&
              gifs.map((gif) => {
                return (
                  <Col>
                    <Card>
                      <Image
                        key={gif.id}
                        src={gif.images.fixed_height_downsampled.url}
                      ></Image>
                      <Card.Body>
                        <Card.Title>{gif.title}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </div>
      </div>
    </Container>
  );
}

export default App;
