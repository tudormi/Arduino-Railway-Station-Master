package ro.mit.stationmaster.dto;

/**
 * Created by Tudormi on 16/5/2015.
 */
public class TrackDTO {

    private int number;
    private int speed;
    private String direction;

    public TrackDTO() {
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
