import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

function Showtimes() {

  const navigate = useNavigate();

  const [
    showtimes,
    setShowtimes
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    const getShowtimes = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await fetch(
            "http://localhost:5000/api/showtimes"
          );

        if (!response.ok) {

          throw new Error(
            "Không thể lấy lịch chiếu"
          );
        }

        const data =
          await response.json();

        setShowtimes(data);

      } catch (error) {

        console.error(
          "Showtime error:",
          error
        );

        setError(
          "Không thể kết nối đến máy chủ."
        );

      } finally {

        setLoading(false);
      }
    };

    getShowtimes();

  }, []);


  const movies =
    showtimes.reduce(
      (result, showtime) => {

        const movieId =
          showtime.movie_id;

        if (!result[movieId]) {

          result[movieId] = {

            movie_id: movieId,

            title:
              showtime.title,

            showtimes: [],
          };
        }

        result[
          movieId
        ].showtimes.push(
          showtime
        );

        return result;

      },
      {}
    );


  const handleSelectShowtime =
    (showtimeId) => {

      navigate(
        `/booking/${showtimeId}`
      );
    };

  return (

    <div className="page-container">

      <div className="page-header">

        <h1>
          Lịch chiếu
        </h1>

        <p>
          Chọn phim, rạp và suất chiếu
        </p>

      </div>


      {loading && (

        <div className="empty-state">

          <div>
            🎬
          </div>

          <h2>
            Đang tải lịch chiếu...
          </h2>

        </div>
      )}


      {!loading &&
        error && (

          <div className="empty-state">

            <div>
              ⚠️
            </div>

            <h2>
              Có lỗi xảy ra
            </h2>

            <p>
              {error}
            </p>

          </div>

        )}


      {!loading &&
        !error &&
        showtimes.length === 0 && (

          <div className="empty-state">

            <div>
              🎟️
            </div>

            <h2>
              Chưa có lịch chiếu
            </h2>

            <p>
              Hiện tại chưa có
              suất chiếu nào.
            </p>

          </div>

        )}


      {!loading &&
        !error &&
        showtimes.length > 0 && (

          <div className="showtime-list">

            {Object.values(
              movies
            ).map((movie) => (

              <div
                className="showtime-movie"
                key={
                  movie.movie_id
                }
              >

                <h2>
                  {movie.title}
                </h2>

                <div className="showtime-grid">

                  {movie.showtimes.map(
                    (showtime) => (

                      <div
                        className="showtime-card"
                        key={
                          showtime.id
                        }
                      >

                        <div className="showtime-date">

                          📅{" "}

                          {new Date(
                            showtime.show_date
                          ).toLocaleDateString(
                            "vi-VN"
                          )}

                        </div>

                        <div className="showtime-room">

                          🏠 Phòng{" "}
                          {
                            showtime.room_id
                          }

                        </div>

                        <div className="showtime-time">

                          🕐{" "}

                          {
                            showtime.start_time
                          }

                          {" - "}

                          {
                            showtime.end_time
                          }

                        </div>

                        <div className="showtime-price">

                          💰{" "}

                          {Number(
                            showtime.price
                          ).toLocaleString(
                            "vi-VN"
                          )}

                          đ

                        </div>

                        <button
                          type="button"
                          className="showtime-button"
                          onClick={() =>
                            handleSelectShowtime(
                              showtime.id
                            )
                          }
                        >

                          Chọn suất chiếu

                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

    </div>

  );
}

export default Showtimes;