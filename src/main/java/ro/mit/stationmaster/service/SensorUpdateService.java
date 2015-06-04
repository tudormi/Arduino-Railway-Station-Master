package ro.mit.stationmaster.service;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.request.async.DeferredResult;
import ro.mit.stationmaster.dto.IRSensorDTO;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Created by tmatrescu on 3/6/2015.
 */
public class SensorUpdateService implements Runnable {

    private final static Logger logger = LogManager.getLogger(SensorUpdateService.class);

    /* requests from client queue */
    private final BlockingQueue<DeferredResult<IRSensorDTO>> resultQueue = new LinkedBlockingQueue<DeferredResult<IRSensorDTO>>();

    /* queue with sensors updates from Arduino */
    @Autowired
    private LinkedBlockingQueue<IRSensorDTO> queue;

    private Thread thread;
    private volatile boolean start = true;


    public void startUpdated() {
        if (start) {
            synchronized (this) {
                if (start) {
                    start = false;
                    thread = new Thread(this);
                    thread.start();
                }
            }
        }
    }

    public void getUpdate(DeferredResult<IRSensorDTO> result) {
        resultQueue.add(result);
    }

    @Override
    public void run() {
        while (true) {
            try {
                /* if a new request is available take it */
                DeferredResult<IRSensorDTO> result = resultQueue.take();
                /* wait for a new update of the sensors */
                IRSensorDTO irSensor = queue.take();
                System.out.println("am gasit un senzor");
                /* when an update is ready put it in result que so that it can be sent to the client */
                result.setResult(irSensor);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
