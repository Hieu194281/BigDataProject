FROM golang:latest

WORKDIR /opt/recommendation

COPY go.sum .
COPY go.mod .

RUN go mod download

COPY . .
COPY config.env .

RUN go build -o main .
ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT [ "./main" ]