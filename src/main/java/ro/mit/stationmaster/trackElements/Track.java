package ro.mit.stationmaster.trackElements;

/**
 * Created by tmatrescu on 11/5/2015.
 */
public class Track {

    private int number;
    private int speed;
    /* empty, present */
    private String direction;
    private String state;
    private int sensorCounter;

    public Track(int trackNumber, int trackSpeed, String direction) {
        this.number = trackNumber;
        this.speed = trackSpeed;
        this.direction = direction;
    }

    public Track() {
    }

    public Track(int number, int speed, String direction, String state, int sensorCounter) {
        this.number = number;
        this.speed = speed;
        this.direction = direction;
        this.state = state;
        this.sensorCounter = sensorCounter;
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

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getSensorCounter() {
        return sensorCounter;
    }

    public void setSensorCounter(int sensorCounter) {
        this.sensorCounter = sensorCounter;
    }
}
