package ro.mit.stationmaster.layout;

/**
 * Created by tmatrescu on 11/5/2015.
 */
public class Track {

    private int trackNumber;
    private int trackSpeed;
    private String direction;

    public Track(int trackNumber, int trackSpeed, String direction) {
        this.trackNumber = trackNumber;
        this.trackSpeed = trackSpeed;
        this.direction = direction;
    }

    public Track() {
    }

    public int getTrackNumber() {
        return trackNumber;
    }

    public void setTrackNumber(int trackNumber) {
        this.trackNumber = trackNumber;
    }

    public int getTrackSpeed() {
        return trackSpeed;
    }

    public void setTrackSpeed(int trackSpeed) {
        this.trackSpeed = trackSpeed;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
