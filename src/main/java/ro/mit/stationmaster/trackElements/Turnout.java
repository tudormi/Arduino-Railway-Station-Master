package ro.mit.stationmaster.trackElements;

/**
 * Created by tmatrescu on 11/5/2015.
 */
public class Turnout {

    private int number;
    private int direction;

    public Turnout() {
    }

    public Turnout(int number, int direction) {
        this.number = number;
        this.direction = direction;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public int getDirection() {
        return direction;
    }

    public void setDirection(int direction) {
        this.direction = direction;
    }
}
