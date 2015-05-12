package ro.mit.stationmaster.layout;

/**
 * Created by tmatrescu on 11/5/2015.
 */
public class Track {

    private int number;
    private int speed;
    private String direction;

    public Track(int trackNumber, int trackSpeed, String direction) {
        this.number = trackNumber;
        this.speed = trackSpeed;
        this.direction = direction;
    }

    public Track() {
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
